const EmailService = {
    templates: {
        welcome: (userName, email) => ({
            subject: '🎉 Welcome to Melo - Your Mental Wellness Companion',
            body: `
Hi ${userName || 'Friend'},

Welcome to Melo! 🌟

We're thrilled to have you join our community of people dedicated to mental wellness. Melo is designed specifically to help Gen Z manage anxiety, depression, and social isolation through journaling, mindfulness exercises, and anonymous community support.

**Here's what you can do with Melo:**
🧠 Chat with Auri - Your AI mental wellness companion
📓 Journal your thoughts and track your mood
🧘 Try breathing exercises and grounding techniques
💬 Join The Vent Room - Anonymous support space
🛠️ Explore our Toolkit for coping strategies
🆘 Access mental health resources and hotlines

**Getting Started:**
1. Talk to Auri about how you're feeling
2. Try a journaling exercise to express yourself
3. Explore The Vent Room to connect with others
4. Check out the Toolkit for helpful exercises

Remember: You're not alone. We're here to support you on your mental wellness journey.

Take care of yourself! 💙

Best regards,
The Melo Team

P.S. If you have any questions or feedback, we'd love to hear from you!
            `
        }),

        thankYou: (userName, email) => ({
            subject: '💙 Thank You for Using Melo!',
            body: `
Hi ${userName || 'Friend'},

Thank you for choosing Melo as your mental wellness companion! 💙

Your decision to prioritize your mental health is a big step, and we're honored to be part of your journey. Every conversation you have with Auri, every journal entry you write, and every moment you spend in our community matters.

**Your Impact:**
By using Melo, you're:
✨ Taking active steps toward better mental health
🤝 Building a stronger support community
📈 Contributing to research on Gen Z mental wellness
💪 Inspiring others to seek help

We're constantly working to improve Melo based on your feedback and needs. Your voice matters!

Keep taking care of yourself,
The Melo Team

P.S. Don't forget - if you're in crisis, please reach out to a mental health professional or call a crisis hotline immediately.
            `
        }),

        updates: (userName, email) => ({
            subject: '🚀 Exciting Updates Coming to Melo!',
            body: `
Hi ${userName || 'Friend'},

We have some exciting news! We're constantly improving Melo to better serve your mental wellness needs.

**Coming Soon to Melo:**
🎯 **Mood Tracking Analytics** - Visualize your emotional patterns over time
👥 **Peer Support Groups** - Connect with others going through similar experiences
🎵 **Guided Meditations** - Curated meditation sessions for anxiety and stress relief
📊 **Weekly Wellness Reports** - Get insights into your mental health trends
🤝 **Therapist Integration** - Connect with verified mental health professionals
🌙 **Night Mode** - Easy on the eyes for late-night journaling
⭐ **Personalized Recommendations** - Get suggestions based on your needs
🏆 **Achievement Badges** - Celebrate your mental wellness milestones

**Your Feedback Matters:**
We want to build features that YOU need. If you have ideas or suggestions, please let us know at: feedback@meloapp.com

Thank you for being part of the Melo community!

With gratitude,
The Melo Team

---
Follow us for updates:
🐦 Twitter: @MeloApp
📱 Instagram: @MeloWellness
💻 Website: www.meloapp.com
            `
        })
    },

    async sendWelcomeEmail(email, userName) {
        return this.simulateSendEmail('welcome', email, userName);
    },

    async sendThankYouEmail(email, userName) {
        return this.simulateSendEmail('thank-you', email, userName);
    },

    async sendUpdateEmail(email, userName) {
        return this.simulateSendEmail('updates', email, userName);
    },

    async simulateSendEmail(type, email, userName = 'User') {
        try {
            let template;
            
            switch(type) {
                case 'welcome':
                    template = this.templates.welcome(userName, email);
                    break;
                case 'thank-you':
                    template = this.templates.thankYou(userName, email);
                    break;
                case 'updates':
                    template = this.templates.updates(userName, email);
                    break;
                default:
                    throw new Error('Unknown email type');
            }

            const emailData = {
                to: email,
                subject: template.subject,
                body: template.body,
                timestamp: new Date().toISOString(),
                type: type
            };

            console.log(`[EMAIL] Simulated ${type} email sent to ${email}`);
            console.log(`[EMAIL] Subject: ${template.subject}`);
            console.log(`[EMAIL] ====================================`);
            
            this.logEmailToConsole(emailData);

            return {
                success: true,
                message: `${type} email simulated successfully`,
                data: emailData
            };
        } catch (error) {
            console.error(`[EMAIL] Failed to send ${type} email:`, error);
            return {
                success: false,
                message: `Failed to send ${type} email`,
                error: error.message
            };
        }
    },

    logEmailToConsole(emailData) {
        console.log(`
╔════════════════════════════════════════════════════════╗
║                   EMAIL NOTIFICATION                   ║
╠════════════════════════════════════════════════════════╣
║ TO:       ${emailData.to.padEnd(48)}║
║ TYPE:     ${emailData.type.padEnd(48)}║
║ TIME:     ${new Date(emailData.timestamp).toLocaleString().padEnd(48)}║
╠════════════════════════════════════════════════════════╣
║ SUBJECT:  ${emailData.subject.substring(0, 48).padEnd(48)}║
╚════════════════════════════════════════════════════════╝
        `);
    },

    async sendAutomatedSequence(email, userName) {
        try {
            await this.sendWelcomeEmail(email, userName);
            
            setTimeout(async () => {
                await this.sendThankYouEmail(email, userName);
            }, 5000);

            setTimeout(async () => {
                await this.sendUpdateEmail(email, userName);
            }, 10000);

            return { success: true, message: 'Email sequence started' };
        } catch (error) {
            console.error('Error sending email sequence:', error);
            return { success: false, message: 'Failed to start email sequence' };
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailService;
}

if (typeof window !== 'undefined') {
    window.EmailService = EmailService;
}
