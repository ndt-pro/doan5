using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace WeMe.Models
{
    public partial class WeMeContext : DbContext
    {
        //public WeMeContext()
        //{
        //}

        public WeMeContext(DbContextOptions<WeMeContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Messagebox> Messagebox { get; set; }
        public virtual DbSet<Messages> Messages { get; set; }
        public virtual DbSet<NewfeedComments> NewfeedComments { get; set; }
        public virtual DbSet<NewfeedLikes> NewfeedLikes { get; set; }
        public virtual DbSet<Newfeeds> Newfeeds { get; set; }
        public virtual DbSet<Notification> Notification { get; set; }
        public virtual DbSet<Users> Users { get; set; }

        //        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //        {
        //            if (!optionsBuilder.IsConfigured)
        //            {
        //#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
        //                optionsBuilder.UseSqlServer("Server=NDTPRO\\SQLEXPRESS;Database=WeMe;Integrated Security=True");
        //            }
        //        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Messagebox>(entity =>
            {
                entity.ToTable("messagebox");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.FromUserId).HasColumnName("from_user_id");

                entity.Property(e => e.ToUserId).HasColumnName("to_user_id");

                entity.HasOne(d => d.FromUser)
                    .WithMany(p => p.MessageboxFromUser)
                    .HasForeignKey(d => d.FromUserId)
                    .HasConstraintName("FK__messagebo__from___47DBAE45");

                entity.HasOne(d => d.ToUser)
                    .WithMany(p => p.MessageboxToUser)
                    .HasForeignKey(d => d.ToUserId)
                    .HasConstraintName("FK__messagebo__to_us__48CFD27E");
            });

            modelBuilder.Entity<Messages>(entity =>
            {
                entity.ToTable("messages");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Content)
                    .IsRequired()
                    .HasColumnName("content")
                    .HasColumnType("ntext");

                entity.Property(e => e.CreatedAt)
                    .HasColumnName("created_at")
                    .HasColumnType("datetime");

                entity.Property(e => e.FromUserId).HasColumnName("from_user_id");

                entity.Property(e => e.Media).HasColumnName("media");

                entity.Property(e => e.Status).HasColumnName("status");

                entity.Property(e => e.ToUserId).HasColumnName("to_user_id");

                entity.HasOne(d => d.FromUser)
                    .WithMany(p => p.MessagesFromUser)
                    .HasForeignKey(d => d.FromUserId)
                    .HasConstraintName("FK__messages__from_u__440B1D61");

                entity.HasOne(d => d.ToUser)
                    .WithMany(p => p.MessagesToUser)
                    .HasForeignKey(d => d.ToUserId)
                    .HasConstraintName("FK__messages__to_use__44FF419A");
            });

            modelBuilder.Entity<NewfeedComments>(entity =>
            {
                entity.ToTable("newfeed_comments");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Content)
                    .IsRequired()
                    .HasColumnName("content")
                    .HasColumnType("ntext");

                entity.Property(e => e.CreatedAt)
                    .HasColumnName("created_at")
                    .HasColumnType("datetime");

                entity.Property(e => e.IdNewfeed).HasColumnName("id_newfeed");

                entity.Property(e => e.IdUser).HasColumnName("id_user");

                entity.HasOne(d => d.IdNewfeedNavigation)
                    .WithMany(p => p.NewfeedComments)
                    .HasForeignKey(d => d.IdNewfeed)
                    .HasConstraintName("FK__newfeed_c__id_ne__403A8C7D");

                entity.HasOne(d => d.IdUserNavigation)
                    .WithMany(p => p.NewfeedComments)
                    .HasForeignKey(d => d.IdUser)
                    .HasConstraintName("FK__newfeed_c__id_us__412EB0B6");
            });

            modelBuilder.Entity<NewfeedLikes>(entity =>
            {
                entity.ToTable("newfeed_likes");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.IdNewfeed).HasColumnName("id_newfeed");

                entity.Property(e => e.IdUser).HasColumnName("id_user");

                entity.HasOne(d => d.IdNewfeedNavigation)
                    .WithMany(p => p.NewfeedLikes)
                    .HasForeignKey(d => d.IdNewfeed)
                    .HasConstraintName("FK__newfeed_l__id_ne__3C69FB99");

                entity.HasOne(d => d.IdUserNavigation)
                    .WithMany(p => p.NewfeedLikes)
                    .HasForeignKey(d => d.IdUser)
                    .HasConstraintName("FK__newfeed_l__id_us__3D5E1FD2");
            });

            modelBuilder.Entity<Newfeeds>(entity =>
            {
                entity.ToTable("newfeeds");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Content)
                    .IsRequired()
                    .HasColumnName("content")
                    .HasColumnType("ntext");

                entity.Property(e => e.CreatedAt)
                    .HasColumnName("created_at")
                    .HasColumnType("datetime");

                entity.Property(e => e.IdUser).HasColumnName("id_user");

                entity.Property(e => e.Media).HasColumnName("media");

                entity.HasOne(d => d.IdUserNavigation)
                    .WithMany(p => p.Newfeeds)
                    .HasForeignKey(d => d.IdUser)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__newfeeds__id_use__398D8EEE");
            });

            modelBuilder.Entity<Notification>(entity =>
            {
                entity.ToTable("notification");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Content)
                    .IsRequired()
                    .HasColumnName("content")
                    .HasColumnType("ntext");

                entity.Property(e => e.CreatedAt)
                    .HasColumnName("created_at")
                    .HasColumnType("datetime");

                entity.Property(e => e.FromUserId).HasColumnName("from_user_id");

                entity.Property(e => e.RememberId).HasColumnName("remember_id");

                entity.Property(e => e.Status).HasColumnName("status");

                entity.Property(e => e.ToUserId).HasColumnName("to_user_id");

                entity.Property(e => e.Type).HasColumnName("type");

                entity.HasOne(d => d.FromUser)
                    .WithMany(p => p.NotificationFromUser)
                    .HasForeignKey(d => d.FromUserId)
                    .HasConstraintName("FK__notificat__from___4BAC3F29");

                entity.HasOne(d => d.ToUser)
                    .WithMany(p => p.NotificationToUser)
                    .HasForeignKey(d => d.ToUserId)
                    .HasConstraintName("FK__notificat__to_us__4CA06362");
            });

            modelBuilder.Entity<Users>(entity =>
            {
                entity.ToTable("users");

                entity.HasIndex(e => e.Email)
                    .HasName("UQ__users__AB6E61647299A329")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Address).HasColumnName("address");

                entity.Property(e => e.Avatar)
                    .IsRequired()
                    .HasColumnName("avatar");

                entity.Property(e => e.Birthday)
                    .HasColumnName("birthday")
                    .HasColumnType("date");

                entity.Property(e => e.CreatedAt)
                    .HasColumnName("created_at")
                    .HasColumnType("datetime");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasColumnName("email")
                    .HasMaxLength(100);

                entity.Property(e => e.FullName)
                    .IsRequired()
                    .HasColumnName("full_name")
                    .HasMaxLength(50);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasColumnName("password");

                entity.Property(e => e.PhoneNumber)
                    .HasColumnName("phone_number")
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.Role).HasColumnName("role");

                entity.Property(e => e.Story).HasColumnName("story");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
