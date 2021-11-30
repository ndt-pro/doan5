using System;
using System.Collections.Generic;

namespace WeMe.Models
{
    public partial class Messages
    {
        public int Id { get; set; }
        public int? FromUserId { get; set; }
        public int? ToUserId { get; set; }
        public string Content { get; set; }
        public string Media { get; set; }
        public byte Status { get; set; }
        public DateTime? CreatedAt { get; set; }

        public virtual Users FromUser { get; set; }
        public virtual Users ToUser { get; set; }
    }

    public partial class MessagesClone
    {
        public int? ToUserId { get; set; }
        public string Content { get; set; }
        public string[] Media { get; set; }

        public Messages get()
        {
            return new Messages()
            {
                ToUserId = ToUserId,
                Content = Content,
            };
        }
    }
}
