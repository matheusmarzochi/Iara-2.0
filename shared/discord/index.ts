import { Research } from '../database/schema'

export async function sendNewUserNotification(email: string): Promise<void> {
    const userLink = `${process.env.NEXT_PUBLIC_APP_URL}/admin/users`;
    const message = `:tada: **Novo usuário cadastrado!**\n**Email:** ${email}\n**Mais informações:** ${userLink}`;
    await sendMessage(message);
}

export async function sendNewResearchNotification(userEmail: string, researchName: string, researchId: string): Promise<void> {
    const researchLink = `${process.env.NEXT_PUBLIC_APP_URL}/admin/researches/${researchId}`;
    const message = `:bulb: **Nova pesquisa criada!**\n**Usuário:** ${userEmail}\n**Pesquisa:** ${researchName}\n**Confira:** ${researchLink}`;
    await sendMessage(message);
}

export async function sendResearchStatusUpdateNotification(userEmail: string, researchName: string, newStatus: Research["status"], researchId: string): Promise<void> {
    const researchLink = `${process.env.NEXT_PUBLIC_APP_URL}/admin/researches/${researchId}`;
    const message = `:arrow_up: **Status da pesquisa alterado!**\n**Usuário:** ${userEmail}\n**Pesquisa:** ${researchName}\n**Novo Status:** ${newStatus}\n**Acesse:** ${researchLink}`;
    await sendMessage(message);
}

export async function sendNewResearchUploadNotification(userEmail: string, researchName: string, researchId: string): Promise<void> {
    const researchLink = `${process.env.NEXT_PUBLIC_APP_URL}/admin/researches/${researchId}`;
    const message = `:inbox_tray: **Novo upload de arquivo!**\n**Usuário:** ${userEmail}\n**Pesquisa:** ${researchName}\n**Confira:** ${researchLink}`;
    await sendMessage(message);
}

export async function sendResearchDeletedNotification(userEmail: string, researchName: string, researchId: string): Promise<void> {
    const researchLink = `${process.env.NEXT_PUBLIC_APP_URL}/admin/researches/${researchId}`;
    const message = `:wastebasket: **Pesquisa deletada!**\n**Usuário:** ${userEmail}\n**Pesquisa:** "${researchName}" foi removida.\n**Link:** ${researchLink}`;
    await sendMessage(message);
}

export async function sendMessage(message: string): Promise<void> {
    // Check if Discord notifications are enabled
    if (process.env.DISCORD_NOTIFICATIONS_ENABLED !== 'true') {
        console.log("ℹ️ Discord notifications are disabled via DISCORD_NOTIFICATIONS_ENABLED env var.");
        return; // Exit early if not enabled
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
        console.error("❌ DISCORD_WEBHOOK_URL is not set in .env, but notifications are enabled.");
        return; // Or throw an error if preferred
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: message }),
        });

        if (!response.ok) {
            // Discord API errors often have useful details in the body
            const errorBody = await response.text();
            throw new Error(`Webhook request failed with status ${response.status}: ${errorBody}`);
        }

        console.log(`✅ Message sent via webhook.`);
    } catch (error: any) {
        console.error(`❌ Error sending message via webhook: ${error.message}`);
    }
}

