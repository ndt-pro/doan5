using System;
using System.Collections.Generic;
using System.Linq;
using WeMe.Models;
using BC = BCrypt.Net.BCrypt;

namespace WeMe.Services
{
    public interface IAuthenticateService
    {
        Users Authenticate(string username, string password);
        Users Create(Users user, string password);
        Users GetById(int id);
    }

    public class AuthenticateService : IAuthenticateService
    {
        private WeMeContext _context;

        public AuthenticateService(WeMeContext context)
        {
            _context = context;
        }

        public Users Authenticate(string email, string password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
                return null;

            var user = _context.Users.SingleOrDefault(x => x.Email == email);

            // check if username exists
            if (user == null)
                return null;

            // check if password is correct
            if (!BC.Verify(password, user.Password))
                return null;

            // authentication successful
            return user;
        }

        public Users Create(Users user, string password)
        {
            // validation
            if (string.IsNullOrWhiteSpace(password))
                throw new Exception("Vui lòng nhập mật khẩu");

            if (_context.Users.Any(x => x.Email == user.Email))
                throw new Exception("Email '" + user.Email + "' đã được đăng ký bởi tài khoản khác");

            string passwordHash = BC.HashPassword(password);

            user.Password = passwordHash;

            _context.Users.Add(user);
            _context.SaveChanges();

            return user;
        }

        public Users GetById(int id)
        {
            return _context.Users.Find(id);
        }
    }
}