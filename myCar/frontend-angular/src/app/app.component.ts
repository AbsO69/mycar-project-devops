import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';  // Import the AuthService

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  constructor(public auth: AuthService) {}  // Inject the AuthService here

  chatbotOpen = false;
  chatbotMessages: string[] = ["Hello! How can I assist you today?"];
  userMessage: string = "";

  toggleChatbot() {
    this.chatbotOpen = !this.chatbotOpen;
  }

  sendMessage() {
    if (this.userMessage.trim() !== "") {
      this.chatbotMessages.push("You: " + this.userMessage);
      this.autoReply(this.userMessage);
      this.userMessage = "";
    }
  }

  autoReply(message: string) {
    setTimeout(() => {
      if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
        this.chatbotMessages.push("Bot: Hello there! 👋");
      } else if (message.toLowerCase().includes('car')) {
        this.chatbotMessages.push("Bot: You can manage cars from the 'Cars' section 🚗.");
      } else {
        this.chatbotMessages.push("Bot: I'm still learning! Please explore the app. 🤖");
      }
    }, 1000); 
  }
}
