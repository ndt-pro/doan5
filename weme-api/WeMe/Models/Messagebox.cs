using System;
using System.Collections.Generic;

namespace WeMe.Models
{
    public partial class Messagebox
    {
        public int Id { get; set; }
        public int? FromUserId { get; set; }
        public int? ToUserId { get; set; }

        public virtual Users FromUser { get; set; }
        public virtual Users ToUser { get; set; }
    }
}
