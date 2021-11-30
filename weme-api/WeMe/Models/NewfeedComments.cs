using System;
using System.Collections.Generic;

namespace WeMe.Models
{
    public partial class NewfeedComments
    {
        public int Id { get; set; }
        public int? IdNewfeed { get; set; }
        public int? IdUser { get; set; }
        public string Content { get; set; }
        public DateTime? CreatedAt { get; set; }

        public virtual Newfeeds IdNewfeedNavigation { get; set; }
        public virtual Users IdUserNavigation { get; set; }
    }
}
