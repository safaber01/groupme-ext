export namespace groups {
    export { groupsIndex as index };
    export { groupsFormer as former };
    export { groupsShow as show };
    export { groupsCreate as create };
    export { groupsUpdate as update };
    export { groupsDestroy as destroy };
    export { groupsJoin as join };
    export { groupsRejoin as rejoin };
    export { groupsChown as changeOwners };
}
export namespace members {
    export { membersAdd as add };
    export { membersResults as results };
    export { membersRemove as remove };
    export { membersUpdate as update };
}
export namespace messages {
    export { messagesIndex as index };
    export { messagesCreate as create };
}
export namespace chats {
    export { chatsIndex as index };
}
export namespace directMessages {
    export { dmsIndex as index };
    export { dmsCreate as create };
}
export namespace likes {
    export { likesCreate as create };
    export { likesDestroy as destroy };
}
export namespace leaderboard {
    export { leaderboardIndex as index };
    export { leaderboardLikes as myLikes };
    export { leaderboardHits as myHits };
}
export namespace bots {
    export { botsCreate as create };
    export { botsPost as post };
    export { botsIndex as index };
    export { botsUpdate as update };
    export { botsDestroy as destroy };
}
export namespace users {
    export { usersMe as me };
    export { usersUpdate as update };
}
export namespace smsMode {
    export { smsCreate as create };
    export { smsDelete as delete };
}
export namespace blocks {
    export { blocksIndex as index };
    export { blocksBetween as blockBetween };
    export { blocksCreate as createBlock };
    export { blocksUnblock as unblock };
}
export namespace pictures {
    export { picturesPictures as pictures };
}

type attachment = {
    type: 'image';
    url: string;
} | {
    type: 'location';
    lat: string;
    lng: string;
    name: string;
} | {
    type: 'emoji';
    placeholder: string;
    charmap: number[][];
} | {
    type: 'mentions';
    loci: number[][];
    user_ids: string[];
}
type Group = {
    id: string;
    name: string;
    type: string;
    description: string;
    image_url: string;
    creator_user_id: string;
    created_at: number;
    updated_at: number;
    members: {
        user_id: string;
        nickname: string;
        muted: boolean;
        image_url: string;
    }[];
    share_url: string;
    messages: {
        count: number;
        last_message_id: string;
        last_message_created_at: number;
        preview: {
            nickname: string;
            text: string;
            image_url: string;
            attachments: attachment[];
        };
    }[];
}
type member = {
    nickname: string;
    user_id?: string;
    phone_number?: string;
    email?: string;
    guid?: string;
}
type Member = {
    id: string;
    user_id: string;
    nickname: string;
    muted: boolean;
    image_url: string;
    autokicked: boolean;
    app_installed: boolean;
    guid: string;
}
type Message = {
    id: string;
    source_guid: string;
    created_at: number;
    user_id: string;
    group_id: string;
    name: string;
    avatar_url: string;
    text: string;
    system: boolean;
    favorited_by: string[];
    attachments: attachment[];
}
type DirectMessage = {
    id: string;
    source_guid: string;
    recipient_id: string;
    user_id: string;
    created_at: number;
    name: string;
    avatar_url: string;
    text: string;
    favorited_by: string[];
    attachments: attachment[];
}
type Chat = {
    created_at: string;
    updated_at: string;
    last_message: DirectMessage & {
        sender_type: string;
    };
    messages_count: number;
    other_user: {
        avatar_url: string;
        id: string;
        name: string;
    };
}
type Bot = {
    bot_id: string;
    group_id: string;
    name: string;
    avatar_url: string;
    callback_url: string;
    dm_notification: boolean;
}
type User = {
    id: string;
    phone_number: string;
    image_url: string;
    name: string;
    created_at: number;
    updated_at: number;
    email: string;
    sms: boolean;
}
type Block = {
    user_id: string;
    blocked_user_id: string;
    created_at: number;
}

declare function groupsIndex(token: string, omitMemberships: boolean): Promise<Group[]>;
declare function groupsFormer(token: string): Promise<Group[]>;
declare function groupsShow(token: string, id: string): Promise<Group>;
declare function groupsCreate(token: string, name: string, description?: string, image_url?: string, share?: boolean): Promise<Group>;
declare function groupsUpdate(token: string, id: string, name?: string, description?: string, image_url?: string, office_mode?: boolean, share?: boolean): Promise<Group>;
declare function groupsDestroy(token: string, id: string): Promise<void>;
declare function groupsJoin(token: string, id: string, share_token: string): Promise<{
    group: Group;
}>;
declare function groupsRejoin(token: string, group_id: string): Promise<Group>;
declare function groupsChown(token: string, requests: { group_id: string; owner_id: string }[]): Promise<{
    results: {
        group_id: string;
        owner_id: string;
        status: '200' | '400' | '403' | '404' | '405';
    }[];
}>;
declare function membersAdd(token: string, group_id: string, members: member[]): Promise<{
    results_id: string;
}>;
declare function membersResults(token: string, group_id: string, results_id: string): Promise<{
    members: Member[];
}>;
declare function membersRemove(token: string, group_id: string, membership_id: string): Promise<void>;
declare function membersUpdate(token: string, group_id: string, nickname?: string, avatar_url?: string): Promise<Member>;
declare function messagesIndex(token: string, group_id: string): Promise<{
    count: number;
    messages: Message[];
}>;
declare function messagesCreate(token: string, group_id: string, source_guid: string, text?: string, attachments?: attachment[]): Promise<Message>;
declare function chatsIndex(token: string): Promise<Chat[]>;
declare function dmsIndex(token: string, other_user_id: string): Promise<{
    count: number;
    direct_messages: DirectMessage[];
}>;
declare function dmsCreate(token: string, source_guid: string, recipient_id: string, text?: string, attachments?: attachment[]): Promise<{
    message: DirectMessage;
}>;
declare function likesCreate(token: string, conversation_id: string, message_id: string): Promise<void>;
declare function likesDestroy(token: string, conversation_id: string, message_id: string): Promise<void>;
declare function leaderboardIndex(token: string, group_id: string, period: 'day' | 'week' | 'month'): Promise<{
    messages: Message[];
}>;
declare function leaderboardLikes(token: string, group_id: string): Promise<{
    messages: (Message & {
        liked_at: string;
    })[];
}>;
declare function leaderboardHits(token: string, group_id: string): Promise<{
    messages: Message[];
}>;
declare function botsCreate(token: string, name: string, group_id: string, avatar_url?: string, callback_url?: string, dm_notification?: boolean): Promise<Bot>;
declare function botsPost(token: string, bot_id: string, text?: string, picture_url?: string, attachments?: attachment[]): Promise<void>;
declare function botsIndex(token: string): Promise<Bot[]>;
declare function botsUpdate(token: string, bot_id: string, name?: string, avatar_url?: string, callback_url?: string): Promise<void>;
declare function botsDestroy(token: string, bot_id: string): Promise<void>;
declare function usersMe(token: string): Promise<User>;
declare function usersUpdate(token: string, avatar_url?: string, name?: string, email?: string, zip_code?: string): Promise<User>;
declare function smsCreate(token: string, duration: number, registration_id: string): Promise<void>;
declare function smsDelete(token: string): Promise<void>;
declare function blocksIndex(token: string, user: string): Promise<{
    blocks: Block[];
}>;
declare function blocksBetween(token: string, user: string, other_user: string): Promise<{
    between: boolean;
}>;
declare function blocksCreate(token: string, user: string, other_user: string): Promise<{
    block: Block;
}>;
declare function blocksUnblock(token: string, user: string, other_user: string): Promise<void>;
declare function picturesPictures(token: string, format: string, dataStream: any): Promise<{
    payload: {
        url: string;
        picture_url: string;
    };
}>;
export {};