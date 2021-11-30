using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using WeMe.Models;
using WeMe.Services;

namespace WeMe.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IAuthenticateService _authenticateService;
        private readonly WeMeContext _context;
        private readonly IConfiguration _configuration;
        private readonly IFileService _fileService;

        public UsersController(WeMeContext context, IConfiguration configuration, IAuthenticateService authenticateService, IFileService fileService)
        {
            _context = context;
            _configuration = configuration;
            _authenticateService = authenticateService;
            _fileService = fileService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody] Dictionary<string, object> formData)
        {
            string email = formData["Email"].ToString();
            string password = formData["Password"].ToString();
            var user = _authenticateService.Authenticate(email, password);

            if (user == null)
                return BadRequest(new { status = 0, message = "Tài khoản hoặc mật khẩu không chính xác" });

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JWT:Secret"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim("id", user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            // return basic user info and authentication token
            return Ok(new
            {
                user,
                token = tokenString
            });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                string password = formData["Password"].ToString();

                // create user
                var user = new Users();

                user.Email = formData["Email"].ToString();
                user.FullName = formData["FullName"].ToString();
                user.PhoneNumber = formData["PhoneNumber"].ToString();
                user.Address = formData["Address"].ToString();
                user.Avatar = "anonymous.jpg";
                user.Role = 0;
                user.CreatedAt = DateTime.Now;

                user = _authenticateService.Create(user, password);
                return Ok(user);
            }
            catch (Exception ex)
            {
                // return error message if there was an exception
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Users>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Users>> GetUsers(int id)
        {
            var users = await _context.Users.FindAsync(id);

            if (users == null)
            {
                return NotFound();
            }

            return users;
        }

        [HttpPut]
        public async Task<IActionResult> PutUsers([FromBody] Users users)
        {
            int userId = int.Parse(User.Identity.Name);
            try
            {
                var user = _context.Users.Find(userId);

                user.FullName = users.FullName;
                user.PhoneNumber = users.PhoneNumber;
                user.Address = users.Address;
                user.Story = users.Story;
                user.Birthday = users.Birthday.GetValueOrDefault().AddDays(1);

                if(users.Avatar != null)
                {
                    if ((user.Avatar = _fileService.WriteFileBase64(users.Avatar)) == null)
                    {
                        user.Avatar = "anonymous.jpg";
                    }
                }

                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                return Ok(new { status = true , user});
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsersExists(userId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Users>> DeleteUsers(int id)
        {
            var users = await _context.Users.FindAsync(id);
            if (users == null)
            {
                return NotFound();
            }

            _context.Users.Remove(users);
            await _context.SaveChangesAsync();

            return users;
        }

        private bool UsersExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        [AllowAnonymous]
        [HttpGet("welcome")]
        public ActionResult Welcome()
        {
            return Ok(new { text = "Welcome" });
        }
    }
}
