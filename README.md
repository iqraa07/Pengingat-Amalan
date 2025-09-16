# Taubat & Hijrah - Islamic Spiritual Journey Tracker

A beautiful, comprehensive web application designed to help Muslims maintain consistency in their spiritual journey of repentance (taubat) and self-improvement (hijrah).

## Features

### 🕌 Core Spiritual Tracking
- **Daily Prayer Tracker**: Track all five daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha)
- **Quran Reading**: Monitor daily Quran recitation
- **Dhikr & Remembrance**: Track dhikr sessions and istighfar
- **Charitable Acts**: Record daily acts of kindness and charity
- **Personal Reflection**: Daily spiritual journal for self-reflection

### 📱 Smart Features
- **Progress Visualization**: Beautiful circular progress indicators
- **Streak Counter**: Maintain and visualize consistency streaks
- **Prayer Times**: Display local prayer times with location detection
- **Islamic Calendar**: Show current Hijri date alongside Gregorian
- **Motivational Quotes**: Daily verses from Quran and authentic Hadith

### 🤖 Telegram Integration
- **Daily Reports**: Automated progress reports sent to Telegram
- **Accountability Partner**: Regular check-ins and reminders
- **Motivational Messages**: Inspirational Islamic content delivery
- **Real-time Updates**: Instant notifications for spiritual milestones

### 🎨 Islamic Design
- **Authentic Aesthetics**: Islamic geometric patterns and Arabic calligraphy
- **Calming Colors**: Peaceful greens, blues, and earth tones
- **Responsive Design**: Beautiful interface across all devices
- **Cultural Sensitivity**: Respectful representation of Islamic values

## Telegram Bot Setup

### Prerequisites
1. Create a Telegram Bot:
   - Message [@BotFather](https://t.me/BotFather) on Telegram
   - Use `/newbot` command to create a new bot
   - Save your bot token

2. Get Your Chat ID:
   - Start a conversation with your bot
   - Send any message to the bot
   - Visit `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find your chat ID in the response

### Configuration
The application is pre-configured with:
- **Bot Token**: `6968952940:AAHSjZqU2tuQ0UPLMB_WCtQ_quFxxRVNPJU`
- **Chat ID**: `965058766`

To use your own bot:
1. Open `src/services/telegramService.ts`
2. Replace the `TELEGRAM_BOT_TOKEN` with your token
3. Replace the `CHAT_ID` with your chat ID

### Bot Commands
Set these commands for your bot using BotFather:
```
/start - Start using the spiritual tracker
/report - Get today's progress report
/motivation - Receive motivational message
/reminder - Set up daily reminders
/help - Show available commands
```

## Installation & Development

### Requirements
- Node.js 16+ 
- npm or yarn

### Setup
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd taubat-hijrah-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx       # Main header with Islamic calendar
│   ├── HabitTracker.tsx # Daily spiritual practices tracker
│   ├── ProgressSummary.tsx # Progress visualization
│   ├── MotivationalQuotes.tsx # Quranic verses and Hadith
│   ├── PrayerTimes.tsx  # Local prayer times display
│   ├── ReflectionJournal.tsx # Personal reflection journal
│   └── TelegramIntegration.tsx # Telegram bot controls
├── services/            # API services
│   └── telegramService.ts # Telegram Bot API integration
├── utils/              # Utility functions
│   └── storage.ts      # Local storage management
├── types/              # TypeScript type definitions
│   └── index.ts        # Type definitions
├── styles/             # Styling
│   └── islamic-patterns.css # Islamic design patterns
└── App.tsx             # Main application component
```

## Customization

### Adding New Habits
To add new spiritual practices:

1. **Update types** in `src/types/index.ts`:
   ```typescript
   export interface Habit {
     // ... existing habits
     newHabit: boolean;
   }
   ```

2. **Update habit configuration** in `src/components/HabitTracker.tsx`:
   ```typescript
   const habitConfig = [
     // ... existing habits
     { 
       key: 'newHabit', 
       label: 'New Spiritual Practice', 
       icon: YourIcon, 
       color: 'text-color-600', 
       arabic: 'العربية' 
     }
   ];
   ```

### Prayer Time Integration
For accurate prayer times, integrate with APIs like:
- [Aladhan API](https://aladhan.com/prayer-times-api)
- [Islamic Finder API](https://www.islamicfinder.org/api/)
- [PrayTimes.js](http://praytimes.org/code/)

Example integration:
```typescript
const fetchPrayerTimes = async (latitude: number, longitude: number) => {
  const response = await fetch(
    `http://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
  );
  const data = await response.json();
  return data.data.timings;
};
```

### Styling Customization
- **Colors**: Modify CSS variables in `src/styles/islamic-patterns.css`
- **Patterns**: Customize geometric patterns using CSS background properties
- **Typography**: Update Arabic font imports for different calligraphy styles
- **Responsive**: Adjust breakpoints in Tailwind configuration

### Telegram Features
Extend Telegram functionality:

1. **Scheduled Reminders**:
   ```typescript
   const scheduleReminders = () => {
     // Set up cron jobs for regular reminders
     // Remind before each prayer time
     // Weekly progress summaries
   };
   ```

2. **Group Integration**:
   ```typescript
   const sendToGroup = async (message: string, groupChatId: string) => {
     // Send messages to Islamic study groups
     // Share progress with accountability partners
   };
   ```

## Deployment

### Netlify (Recommended)
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push

### Vercel
1. Import project in Vercel dashboard
2. Configure build settings (automatic for Vite)
3. Deploy with zero configuration

### Traditional Hosting
1. Build the project: `npm run build`
2. Upload `dist/` folder to your hosting provider
3. Ensure proper routing for SPA

## Privacy & Security

- **Data Storage**: All personal data stored locally in browser
- **Telegram**: Only sends data you explicitly share
- **No Tracking**: No analytics or tracking scripts
- **Open Source**: Fully transparent codebase

## Islamic Compliance

This application is designed with Islamic principles in mind:
- ✅ Encourages good deeds and spiritual growth
- ✅ Uses authentic Quranic verses and verified Hadith
- ✅ Respects Islamic calendar and prayer times
- ✅ Promotes accountability and community
- ✅ Free from interest (riba) or gambling elements

## Contributing

We welcome contributions that enhance the spiritual journey experience:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/islamic-calendar`
3. **Make changes** following Islamic guidelines
4. **Test thoroughly** with various use cases
5. **Submit pull request** with clear description

### Contribution Guidelines
- Ensure all Islamic content is authentic and properly sourced
- Maintain respectful and appropriate language
- Test Telegram integration thoroughly
- Update documentation for new features
- Follow existing code style and patterns

## Support & Community

- **Issues**: Report bugs or request features on GitHub
- **Discussions**: Join community discussions for Islamic tech
- **Documentation**: Contribute to docs and translations
- **Sharing**: Help spread awareness in the Muslim community

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Islamic scholars for guidance on spiritual practices
- Telegram Bot API for communication features  
- Prayer time calculation algorithms
- Islamic geometric art inspiration
- Open source contributors and testers

---

**May Allah (SWT) accept our efforts and make this tool beneficial for the Ummah. Ameen.**

*"And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose."* - Quran 65:3