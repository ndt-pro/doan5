using System;
using System.Collections.Generic;

namespace WeMe.Models
{
    public partial class Users
    {
        public Users()
        {
            MessageboxFromUser = new HashSet<Messagebox>();
            MessageboxToUser = new HashSet<Messagebox>();
            MessagesFromUser = new HashSet<Messages>();
            MessagesToUser = new HashSet<Messages>();
            NewfeedComments = new HashSet<NewfeedComments>();
            NewfeedLikes = new HashSet<NewfeedLikes>();
            Newfeeds = new HashSet<Newfeeds>();
            NotificationFromUser = new HashSet<Notification>();
            NotificationToUser = new HashSet<Notification>();
        }

        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public string Story { get; set; }
        public DateTime? Birthday { get; set; }
        public string Avatar { get; set; }
        public byte Role { get; set; }
        public DateTime? CreatedAt { get; set; }

        public virtual ICollection<Messagebox> MessageboxFromUser { get; set; }
        public virtual ICollection<Messagebox> MessageboxToUser { get; set; }
        public virtual ICollection<Messages> MessagesFromUser { get; set; }
        public virtual ICollection<Messages> MessagesToUser { get; set; }
        public virtual ICollection<NewfeedComments> NewfeedComments { get; set; }
        public virtual ICollection<NewfeedLikes> NewfeedLikes { get; set; }
        public virtual ICollection<Newfeeds> Newfeeds { get; set; }
        public virtual ICollection<Notification> NotificationFromUser { get; set; }
        public virtual ICollection<Notification> NotificationToUser { get; set; }
    }
}
