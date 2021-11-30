using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BTL_API.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeMe.Models;

namespace WeMe.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class NewfeedCommentsController : ControllerBase
    {
        private readonly WeMeContext _context;

        public NewfeedCommentsController(WeMeContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<NewfeedComments>> GetCommentById(int id)
        {
            var newfeedComments = await _context.NewfeedComments.FindAsync(id);

            if (newfeedComments == null)
            {
                return NotFound();
            }

            return newfeedComments;
        }

        [HttpGet("comment/{id}")]
        public ActionResult GetNewfeedComments(int id, int page)
        {
            var cmt = _context.NewfeedComments
                .Select(cmt => new {
                    cmt.IdNewfeed,
                    cmt.Content,
                    cmt.CreatedAt,
                    user = new
                    {
                        cmt.IdUserNavigation.Id,
                        cmt.IdUserNavigation.FullName,
                        cmt.IdUserNavigation.Avatar,
                    }
                })
                .Where(cmt => cmt.IdNewfeed == id)
                .OrderByDescending(cmt => cmt.CreatedAt);

            var data = Pagination.GetPaged(cmt, page, 5);

            return Ok(data);
        }

        [HttpPost]
        public async Task<ActionResult> PostComment([FromBody] Dictionary<string, object> formData)
        {
            int userId = int.Parse(User.Identity.Name);
            int idNewFeed = int.Parse(formData["idNewfeed"].ToString());
            string content = formData["content"].ToString();

            var cmt = new NewfeedComments();

            cmt.IdNewfeed = idNewFeed;
            cmt.IdUser = userId;
            cmt.Content = content;
            cmt.CreatedAt = DateTime.Now;

            _context.NewfeedComments.Add(cmt);
            await _context.SaveChangesAsync();

            return Ok(new { 
                cmt.IdNewfeed,
                cmt.Content,
                cmt.CreatedAt,
                user = new
                {
                    cmt.IdUserNavigation.Id,
                    cmt.IdUserNavigation.FullName,
                    cmt.IdUserNavigation.Avatar,
                }
            });
        }
    }
}
