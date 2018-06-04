using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using WebApplication2.Models;

namespace WebApplication2.Hubs
{
    public class ChatHub : Hub
    {
        static List<User> Users = new List<User>();
        static List<string> Messages = new List<string>();

        // Отправка сообщений
        public void Send(string name, string message)
        {
            DateTime now = DateTime.Now;
            string timeNow = now.ToString("HH:mm:ss");
            string _message = string.Format("{0} {1}: {2}", timeNow, name, message);
            Messages.Add(_message);
            Clients.All.addMessage(_message);
        }

        // Подключение нового пользователя
        public void Connect(string userName)
        {
            var id = Context.ConnectionId;

            if (!Users.Any(x => x.ConnectionId == id))
            {
                if(!Users.Any(x => x.Name == userName))
                {
                    Users.Add(new User { ConnectionId = id, Name = userName });

                    Clients.Caller.onConnected(id);


                    Clients.AllExcept(id).onNewUserConnected(id, userName);
                }
                else
                {
                    string _message = "Имя занято";
                    Clients.Caller.onDoubleName(_message);
                }
            }
        }

        public void Onload()
        {
            foreach (string _message in Messages)
            {
                Clients.Caller.GetMessages(_message);
            }
        }

        public void Initusers()
        {
            foreach(var user in Users)
            {
                string _name = user.Name;
                Clients.Caller.GetUsersName(_name);
            }
        }

        // Отключение пользователя
        public override System.Threading.Tasks.Task OnDisconnected(bool stopCalled)
        {
            var item = Users.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (item != null)
            {
                Users.Remove(item);
                var id = Context.ConnectionId;
                Clients.All.onUserDisconnected(id, item.Name);
            }

            return base.OnDisconnected(stopCalled);
        }
    }
}