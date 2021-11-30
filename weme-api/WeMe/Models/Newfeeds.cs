using System;
using System.Collections.Generic;

namespace WeMe.Models
{
    public partial class Newfeeds
    {
        public Newfeeds()
        {
            NewfeedComments = new HashSet<NewfeedComments>();
            NewfeedLikes = new HashSet<NewfeedLikes>();
        }

        public int Id { get; set; }
        public int? IdUser { get; set; }
        public string Content { get; set; }
        public string Media { get; set; }
        public DateTime? CreatedAt { get; set; }

        public virtual Users IdUserNavigation { get; set; }
        public virtual ICollection<NewfeedComments> NewfeedComments { get; set; }
        public virtual ICollection<NewfeedLikes> NewfeedLikes { get; set; }
    }
    public partial class NewfeedsClone
    {
        public string Content { get; set; }
        public string[] Media { get; set; }

        public Newfeeds get()
        {
            return new Newfeeds()
            {
                Content = Content,
            };
        }
    }
}
