using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Security.Claims;
using System.Threading.Tasks;
using BTL_API.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using WeMe.Models;
using WeMe.Services;

namespace WeMe.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly WeMeContext _context;
        private readonly IFileService _fileService;

        public MessagesController(WeMeContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        [HttpGet("count-new-message")]
        public ActionResult<Messages> CountNewMessage()
        {
            int userId = int.Parse(User.Identity.Name);
            var box = _context.Messagebox
                .Where(mess => mess.FromUserId == userId && _context.Messages.OrderByDescending(m => m.Id).FirstOrDefault(messx => messx.FromUserId == mess.ToUserId && messx.ToUserId == mess.FromUserId).Status == 0)
                .Select(mess => new
                {
                    fromUserId = mess.ToUserId
                });

            return Ok(box);
        }

        [HttpGet("get-mess-box")]
        public ActionResult<Messages> GetMessageBox()
        {
            int userId = int.Parse(User.Identity.Name);

            var box = _context.Messagebox
                .Select(mess => new
                {
                    fromId = mess.FromUserId,
                    toUser = new
                    {
                        mess.ToUser.Id,
                        mess.ToUser.Avatar,
                        mess.ToUser.FullName,
                    },
                    lastMessage = _context.Messages.OrderByDescending(m => m.Id)
                        .Select(mess => new
                        {
                            mess.FromUserId,
                            mess.ToUserId,
                            mess.Content,
                            status = mess.FromUserId == userId ? 1 : mess.Status,
                            mess.CreatedAt,
                        })
                        .FirstOrDefault(messx => (messx.FromUserId == mess.FromUserId && messx.ToUserId == mess.ToUserId) || (messx.FromUserId == mess.ToUserId && messx.ToUserId == mess.FromUserId))
                })
                .Where(mess => mess.fromId == userId)
                .OrderByDescending(mess => mess.lastMessage.CreatedAt);

            return Ok(box);
        }

        [HttpGet("get-all-mess")]
        public ActionResult<Messages> GetAllMessage(int to_id, int page)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

            //Filter specific claim    
            var id = claims?.FirstOrDefault(x => x.Type.Equals("id", StringComparison.OrdinalIgnoreCase))?.Value;

            int userId = int.Parse(User.Identity.Name);

            var box = _context.Messages
                .Select(mess => new
                {
                    fromUser = new
                    {
                        id = mess.FromUserId,
                        mess.FromUser.FullName,
                        mess.FromUser.Avatar
                    },
                    toUser = new
                    {
                        id = mess.ToUserId,
                        mess.ToUser.FullName,
                        mess.ToUser.Avatar
                    },
                    mess.Content,
                    mess.Media,
                    mess.Status,
                    mess.CreatedAt,
                })
                .Where(mess => (mess.fromUser.id == userId && mess.toUser.id == to_id) || (mess.fromUser.id == to_id && mess.toUser.id == userId))
                .OrderByDescending(mess => mess.CreatedAt);

            var data = Pagination.GetPaged(box, page, 20);
            return Ok(data.Results);
        }

        [HttpPost("send-message")]
        public async Task<ActionResult<Messages>> SendMessage(MessagesClone messages)
        {
            int userId = int.Parse(User.Identity.Name);

            // them tin nhan
            var message = messages.get();
            message.FromUserId = userId;

            string[] medias = new string[0];

            foreach (var item in messages.Media)
            {
                var file = _fileService.WriteFileBase64(item, 2);
                Array.Resize(ref medias, medias.Length + 1);
                medias[medias.Length - 1] = file;
            }

            var json = JsonConvert.SerializeObject(medias);

            message.Media = json;
            message.Status = 0;
            message.CreatedAt = DateTime.Now;

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            // them loi tat tin nhan
            // nguoi gui
            if (!_context.Messagebox.Any(msgBox => msgBox.FromUserId == message.FromUserId && msgBox.ToUserId == message.ToUserId))
            {
                _context.Messagebox.Add(new Messagebox()
                {
                    FromUserId = message.FromUserId,
                    ToUserId = message.ToUserId,
                });
                await _context.SaveChangesAsync();
            }

            // nguoi nhan
            if (!_context.Messagebox.Any(msgBox => msgBox.FromUserId == message.ToUserId && msgBox.ToUserId == message.FromUserId))
            {
                _context.Messagebox.Add(new Messagebox()
                {
                    FromUserId = message.ToUserId,
                    ToUserId = message.FromUserId,
                });
                await _context.SaveChangesAsync();
            }

            //var check = _context.Messages.FirstOrDefault(mess => mess.FromUserId == message.ToUserId && mess.ToUserId == message.FromUserId);

            //if (check == null)
            //{
            //    Messages mess = new Messages();
            //    mess.FromUserId = message.ToUserId;
            //    mess.ToUserId = message.FromUserId;
            //    mess.Content = "Bây giờ các bạn có thể chat với nhau.";
            //    mess.CreatedAt = DateTime.Now;

            //    _context.Messages.Add(mess);
            //    await _context.SaveChangesAsync();
            //}

            message.FromUser = _context.Users.Find(message.FromUserId);
            message.ToUser = _context.Users.Find(message.ToUserId);

            return Ok(new
            {
                fromUser = new
                {
                    id = message.FromUserId,
                    message.FromUser.FullName,
                    message.FromUser.Avatar
                },
                toUser = new
                {
                    id = message.ToUserId,
                    message.ToUser.FullName,
                    message.ToUser.Avatar
                },
                message.Content,
                message.Media,
                message.Status,
            });
        }

        [HttpPut("see-message")]
        public async Task<ActionResult> SeeMessages([FromBody] Dictionary<string, object> formData)
        {
            int userId = int.Parse(User.Identity.Name);

            int toUserId = int.Parse(formData["toUserId"].ToString());

            var messages = _context.Messages
                .Where(mess => mess.FromUserId == userId && mess.ToUserId == toUserId && mess.Status == 0)
                .ToList();

            for (int i = 0; i < messages.Count; i++)
            {
                messages[i].Status = 1;
            }

            if (messages.Count > 0)
            {
                _context.Messages.UpdateRange(messages);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }
    }
}
