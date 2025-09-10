export interface GreetingButton {
    text: string;
    url: string;
}

export interface BotGreeting {
    message: string;
    mediaUrl: string | null;
    buttons: GreetingButton[][];
}

export interface BotSettings {
    banned_words: string[];
    greeting: BotGreeting;
}
