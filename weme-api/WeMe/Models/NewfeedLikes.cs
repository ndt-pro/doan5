using System;
using System.Collections.Generic;

namespace WeMe.Models
{
    public partial class NewfeedLikes
    {
        public int Id { get; set; }
        public int? IdNewfeed { get; set; }
        public int? IdUser { get; set; }

        public virtual Newfeeds IdNewfeedNavigation { get; set; }
        public virtual Users IdUserNavigation { get; set; }
    }
}
