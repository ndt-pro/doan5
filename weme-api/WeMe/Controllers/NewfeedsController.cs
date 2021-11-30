using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
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
    public class NewfeedsController : ControllerBase
    {
        private readonly WeMeContext _context;
        private readonly IFileService _fileService;

        public NewfeedsController(WeMeContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        [HttpGet("{id}")]
        public ActionResult GetNewfeedById(int id)
        {
            int userId = int.Parse(User.Identity.Name);

            var list = _context.Newfeeds
                .Select(newfeed => new
                {
                    user = new
                    {
                        newfeed.IdUserNavigation.Id,
                        newfeed.IdUserNavigation.FullName,
                        newfeed.IdUserNavigation.Avatar
                    },
                    id = newfeed.Id,
                    content = newfeed.Content,
                    media = newfeed.Media,
                    createdAt = newfeed.CreatedAt,
                    countLike = newfeed.NewfeedLikes.Count,
                    countComment = newfeed.NewfeedComments.Count,
                    liked = newfeed.NewfeedLikes.FirstOrDefault(like => like.IdUser == userId) != null
                })
                .FirstOrDefault(newfeed => newfeed.id == id);

            return Ok(list);
        }

        // GET: api/Newfeeds
        [HttpGet]
        public ActionResult GetNewfeeds(int page, int pageSize)
        {
            int userId = int.Parse(User.Identity.Name);

            var list = _context.Newfeeds
                .OrderByDescending(newfeed => newfeed.Id)
                .Select(newfeed => new
                {
                    user = new
                    {
                        newfeed.IdUserNavigation.Id,
                        newfeed.IdUserNavigation.FullName,
                        newfeed.IdUserNavigation.Avatar
                    },
                    id = newfeed.Id,
                    content = newfeed.Content,
                    media = newfeed.Media,
                    createdAt = newfeed.CreatedAt,
                    countLike = newfeed.NewfeedLikes.Count,
                    countComment = newfeed.NewfeedComments.Count,
                    liked = newfeed.NewfeedLikes.FirstOrDefault(like => like.IdUser == userId) != null
                });

            var data = Pagination.GetPaged(list, page, pageSize);

            return Ok(data.Results);
        }

        [HttpGet("get-newfeeds-user/{id}")]
        public ActionResult GetNewfeedsUser(int id, int page, int pageSize)
        {
            int userId = int.Parse(User.Identity.Name);

            var list = _context.Newfeeds
                .OrderByDescending(newfeed => newfeed.Id)
                .Where(newfeed => newfeed.IdUser == id)
                .Select(newfeed => new
                {
                    user = new
                    {
                        newfeed.IdUserNavigation.Id,
                        newfeed.IdUserNavigation.FullName,
                        newfeed.IdUserNavigation.Avatar
                    },
                    id = newfeed.Id,
                    content = newfeed.Content,
                    media = newfeed.Media,
                    createdAt = newfeed.CreatedAt,
                    countLike = newfeed.NewfeedLikes.Count,
                    countComment = newfeed.NewfeedComments.Count,
                    liked = newfeed.NewfeedLikes.FirstOrDefault(like => like.IdUser == userId) != null
                });

            var data = Pagination.GetPaged(list, page, pageSize);

            return Ok(data.Results);
        }

        [HttpGet("get-user-likes/{id}")]
        public async Task<ActionResult> GetNewfeedsLike(int id)
        {
            var list = await _context.NewfeedLikes
                .Select(like => new
                {
                    like.IdNewfeed,
                    like.IdUserNavigation.Id,
                    like.IdUserNavigation.FullName,
                    like.IdUserNavigation.Avatar
                })
                .Where(like => like.IdNewfeed == id)
                .ToListAsync();

            return Ok(list);
        }

        [HttpPost("post-newfeed")]
        public async Task<ActionResult<Newfeeds>> PostNewfeeds(NewfeedsClone newfeeds)
        {
            int userId = int.Parse(User.Identity.Name);

            Newfeeds newfeed = newfeeds.get();
            newfeed.IdUser = userId;

            string[] medias = new string[0];

            foreach (var item in newfeeds.Media)
            {
                var file = _fileService.WriteFileBase64(item, 1);
                Array.Resize(ref medias, medias.Length + 1);
                medias[medias.Length - 1] = file;
            }

            var json = JsonConvert.SerializeObject(medias);

            newfeed.Media = json;
            newfeed.CreatedAt = DateTime.Now;

            _context.Newfeeds.Add(newfeed);
            await _context.SaveChangesAsync();

            return Ok(new { status = true });
        }

        [HttpPost("like-newfeed")]
        public async Task<ActionResult> LikeNewfeed([FromBody] Dictionary<string, object> formData)
        {
            int userId = int.Parse(User.Identity.Name);

            int idNewFeed = int.Parse(formData["idNewfeed"].ToString());

            var checkLike = _context.NewfeedLikes.FirstOrDefault(like => like.IdNewfeed == idNewFeed && like.IdUser == userId);

            bool isLike = false;
            if (checkLike == null)
            {
                // chua like
                var userLike = new NewfeedLikes();

                userLike.IdNewfeed = idNewFeed;
                userLike.IdUser = userId;

                _context.NewfeedLikes.Add(userLike);
                await _context.SaveChangesAsync();

                isLike = true;
            }
            else
            {
                // da like = dislike
                _context.NewfeedLikes.Remove(checkLike);
                await _context.SaveChangesAsync();
            }

            return Ok(new { isLike });
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteNewfeeds(int idPost)
        {
            int userId = int.Parse(User.Identity.Name);

            var post = _context.Newfeeds.FirstOrDefault(newfeed => newfeed.Id == idPost && newfeed.IdUser == userId);

            if (post == null)
            {
                return BadRequest();
            }

            _context.NewfeedLikes.RemoveRange(post.NewfeedLikes);
            await _context.SaveChangesAsync();

            _context.Newfeeds.Remove(post);
            await _context.SaveChangesAsync();

            return Ok(new { post });
        }

        private bool NewfeedsExists(int id)
        {
            return _context.Newfeeds.Any(e => e.Id == id);
        }
    }
}
