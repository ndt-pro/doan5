using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace WeMe.Services
{
    public interface IFileService
    {
        string WriteFile(IFormFile file, int type);
        string WriteFile(IFormFile file);
        string WriteFileBase64(string data, int type);
        string WriteFileBase64(string data);
    }

    public class FileService : IFileService
    {
        private string dir = "Uploads/images";
        private string[] types = new string[] {
            "/avatars",
            "/newfeeds",
            "/messages",
        };

        public string WriteFile(IFormFile file, int type)
        {
            string dir = this.dir + types[type];
            try
            {
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), dir);
                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fileExtension = Path.GetExtension(fileName);
                    fileName = Guid.NewGuid() + fileExtension;
                    var fullPath = Path.Combine(pathToSave, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    return fileName;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception)
            {
                return null;
            }
        }
        public string WriteFile(IFormFile file)
        {
            return WriteFile(file, 0);
        }

        public string WriteFileBase64(string data, int type)
        {
            string dir = this.dir + types[type];

            string[] rdata = data.Split(";");

            try
            {
                if (rdata.Length == 3)
                {
                    string name = rdata[0];
                    string size = rdata[1];
                    string base64 = rdata[2];

                    if (base64.Contains("base64,"))
                    {
                        base64 = base64.Substring(base64.IndexOf("base64,", 0) + 7);
                    }

                    var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), dir);
                    var fileExtension = Path.GetExtension(name);
                    name = Guid.NewGuid() + fileExtension;
                    var fullPath = Path.Combine(pathToSave, name);
                    File.WriteAllBytes(fullPath, Convert.FromBase64String(base64));
                    return name;
                }
            }
            catch (Exception)
            {
            }
            return null;
        }

        public string WriteFileBase64(string data)
        {
            return WriteFileBase64(data, 0);
        }
    }
}
