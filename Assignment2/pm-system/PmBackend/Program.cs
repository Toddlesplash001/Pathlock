using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PmBackend.Data;
using PmBackend.Services;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// -----------------------------------------
// 🔐 CORS Configuration
// -----------------------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVercel", policy =>
    {
        policy
            .WithOrigins("https://pathlock-iota.vercel.app") // Vite dev server
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// -----------------------------------------
// 🧠 Database
// -----------------------------------------
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("PmBackendDb"));

// -----------------------------------------
// 🧩 Services
// -----------------------------------------
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ProjectService>();
builder.Services.AddScoped<TaskService>();

// -----------------------------------------
// 🔑 JWT Authentication
// -----------------------------------------
var jwtKey = builder.Configuration["Jwt:Key"] ?? "local-dev-secret-key";
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false; // 👈 important for localhost
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
        };
    });

// -----------------------------------------
// 🧾 Authorization
// -----------------------------------------
builder.Services.AddAuthorization();

// -----------------------------------------
// 🧮 Controllers
// -----------------------------------------
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });

// -----------------------------------------
// 📘 Swagger
// -----------------------------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// -----------------------------------------
// 🌐 Middleware Order (VERY IMPORTANT)
// -----------------------------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ❌ Disable HTTPS redirect for local dev
// app.UseHttpsRedirection();

// ✅ Must be before Authentication & Controllers
app.UseCors("AllowVercel");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ✅ Handle preflight (OPTIONS) requests explicitly
app.Use(async (context, next) =>
{
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.StatusCode = 200;
        return;
    }
    await next();
});

app.Run();
