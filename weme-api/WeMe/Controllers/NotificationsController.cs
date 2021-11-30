using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using WeMe.Models;

namespace WeMe.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly WeMeContext _context;

        public NotificationsController(WeMeContext context)
        {
            _context = context;
        }

        [HttpGet("get-by-user")]
        public ActionResult GetNotificationByUser()
        {
            int userId = int.Parse(User.Identity.Name);
            var notification = _context.Notification
                .Select(noti => new {
                    noti.Id,
                    fromUser = new
                    {
                        noti.FromUser.Id,
                        noti.FromUser.FullName,
                        noti.FromUser.Avatar,
                    },
                    toUser = new
                    {
                        noti.ToUser.Id,
                        noti.ToUser.FullName,
                        noti.ToUser.Avatar,
                    },
                    noti.RememberId,
                    noti.Content,
                    noti.Type,
                    noti.Status,
                    noti.CreatedAt,
                })
                .Where(noti => noti.toUser.Id == userId)
                .OrderByDescending(noti => noti.Id);

            return Ok(notification);
        }

        [HttpPost]
        public async Task<ActionResult> PostNotification([FromBody] Dictionary<string, object> formData)
        {
            int userId = int.Parse(User.Identity.Name);
            var fromUser = _context.Users.Find(userId);

            var idNewfeed = int.Parse(formData["idNewfeed"].ToString());
            var type = byte.Parse(formData["type"].ToString());

            var newfeed = _context.Newfeeds.Find(idNewfeed);

            if (newfeed == null || fromUser == null || userId == newfeed.IdUser)
            {
                return NoContent();
            }

            var check = _context.Notification.FirstOrDefault(noti => noti.RememberId == idNewfeed && noti.FromUserId == userId && noti.ToUserId == newfeed.IdUser && noti.Type == type && type == 1);

            if(check != null)
            {
                return NoContent();
            }

            var toUser = _context.Users.Find(newfeed.IdUser);

            var notification = new Notification();

            notification.RememberId = idNewfeed;
            notification.FromUserId = userId;
            notification.ToUserId = newfeed.IdUser;
            notification.Type = type;
            if(type == 1)
            {
                notification.Content = "đã thích bài viết của bạn.";
            } else if(type == 2)
            {
                notification.Content = "đã bình luận về bài viết của bạn.";
            }
            notification.Status = 0;
            notification.CreatedAt = DateTime.Now;

            _context.Notification.Add(notification);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                notification.Id,
                fromUser = new
                {
                    fromUser.Id,
                    fromUser.FullName,
                    fromUser.Avatar,
                },
                toUser = new
                {
                    toUser.Id,
                    toUser.FullName,
                    toUser.Avatar,
                },
                notification.RememberId,
                notification.Content,
                notification.Type,
                notification.Status,
                notification.CreatedAt,
            });
        }

        [HttpPut("see-notification")]
        public async Task<ActionResult> SeeNotification([FromBody] Dictionary<string, object> formData)
        {
            int id = int.Parse(formData["id"].ToString());
            var notification = _context.Notification.Find(id);

            if(notification != null)
            {
                notification.Status = 1;

                _context.Update(notification);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }
    }
}
