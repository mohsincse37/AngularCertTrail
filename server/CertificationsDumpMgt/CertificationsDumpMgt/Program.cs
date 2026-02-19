using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Data;
using Service;
using Microsoft.AspNetCore.Identity;
using Data.Repositories;
using Data.Infrastructure;
using Data.ViewModels;
using System.Security.Claims;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IDbFactory, DbFactory>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICertificationTopicService, CertificationTopicService>();
builder.Services.AddScoped<ICertificationTopicRepository, CertificationTopicRepository>();
builder.Services.AddScoped<IQuestionService, QuestionService>();
builder.Services.AddScoped<IQuestionOptionRepository, QuestionOptionRepository>();
builder.Services.AddScoped<IQuestionOptionService, QuestionOptionService>();
builder.Services.AddScoped<IQuestionRepository, QuestionRepository>();
builder.Services.AddScoped<IQuestionCorrectOptionsRepository, QuestionCorrectOptionsRepository>();
builder.Services.AddScoped<IQuestionCorrectOptionsService, QuestionCorrectOptionsService>();
builder.Services.AddScoped<ICertificationSchemeRepository, CertificationSchemeRepository>();
builder.Services.AddScoped<ICertificationSchemeService, CertificationSchemeService>();
builder.Services.AddScoped<IMenuRepository, MenuRepository>();
builder.Services.AddScoped<IMenuService, MenuService>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IRoleMenuRepository, RoleMenuRepository>();
builder.Services.AddScoped<IRoleMenuService, RoleMenuService>();
builder.Services.AddScoped<IUserRoleRepository, UserRoleRepository>();
builder.Services.AddScoped<IUserRoleService, UserRoleService>();
builder.Services.AddScoped<IUserTopicMappingRepository, UserTopicMappingRepository>();
builder.Services.AddScoped<IUserTopicMappingService, UserTopicMappingService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

builder.Services.AddDbContext<CerDumpMgtContext>(options =>
   options.UseSqlServer(builder.Configuration.GetConnectionString("CRUDCS")));

builder.Services.AddIdentity<IdentityUser, IdentityRole>().AddEntityFrameworkStores<CerDumpMgtContext>();

// JWT Configuration
var keyString = builder.Configuration["JwtConfig:Secret"] ?? "DefaultForDevelopmentOnly_MustBeLongerThan32Chars";
var key = Encoding.ASCII.GetBytes(keyString);

var tokenValidationParameters = new TokenValidationParameters
{
    ValidateIssuerSigningKey = true,
    IssuerSigningKey = new SymmetricSecurityKey(key),
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    RequireExpirationTime = true,
    ValidIssuer = builder.Configuration["JwtConfig:Issuer"] ?? "AngularCertTrail",
    ValidAudience = builder.Configuration["JwtConfig:Audience"] ?? "AngularCertTrailUser",
    ClockSkew = TimeSpan.Zero,
    NameClaimType = ClaimTypes.Name,
    RoleClaimType = ClaimTypes.Role
};

builder.Services.AddSingleton(tokenValidationParameters);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(jwt =>
{
    jwt.SaveToken = true;
    jwt.TokenValidationParameters = tokenValidationParameters;
});

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors();

builder.Services.AddDistributedMemoryCache();

builder.Services.AddSession(options =>
{
    // Set a short timeout for easy testing.
    options.IdleTimeout = TimeSpan.FromMinutes(60);    
});

var app = builder.Build();

app.UseSession();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}
app.UseStaticFiles();

app.UseRouting();

app.UseCors(builder =>
{
    builder
    .WithOrigins("http://localhost:4200")
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials();       
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();


