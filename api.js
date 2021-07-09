'use strict';
const axios = require('axios').default;

const stateless = axios.create({
  baseURL: 'https://api.groupme.com/v3',
  headers: {
    post: {
      'Content-Type': 'application/json'
    }
  }
});
const imageService = axios.create({
  baseURL: 'https://image.groupme.com'
});

async function groupsIndex(token, omitMemberships) {
  const groups = [];
  let page = 1;
  let indexPage;
  do {
    const response = await stateless.get(`/groups?${omitMemberships ? 'omit=memberships&' : ''}page=${page}&token=${token}`);
    indexPage = response.data.response;
    ++page;
    groups.push(indexPage);
  } while (indexPage.length)
  return groups.flat();
}

async function groupsFormer(token) {
  const response = await stateless.get(`/groups/former?token=${token}`);
  return response.data.response;
}

async function groupsShow(token, id) {
  const response = await stateless.get(`/groups/${id}?token=${token}`);
  return response.data.response;
}

async function groupsCreate(token, name, description, image_url, share) {
  const response = await stateless.post(`/groups?token=${token}`, { name, description, image_url, share });
  return response.data.response;
}

async function groupsUpdate(token, id, name, description, image_url, office_mode, share) {
  const response = await stateless.post(`/groups/${id}/update?token=${token}`, { name, description, image_url, office_mode, share });
  return response.data.response;
}

async function groupsDestroy(token, id) {
  const response = await stateless.post(`/groups/${id}/destroy?token=${token}`);
  return null;
}

async function groupsJoin(token, id, share_token) {
  const response = await stateless.post(`/groups/${id}/join/${share_token}?token=${token}`);
  return response.data.response;
}

async function groupsRejoin(token, group_id) {
  const response = await stateless.post(`/groups/join?token=${token}`, { group_id });
  return response.data.response;
}

async function groupsChown(token, requests) {
  const response = await stateless.post(`/groups/change_owners?token=${token}`, { requests });
  return response.data.response;
}

async function membersAdd(token, group_id, members) {
  const response = await stateless.post(`/groups/${group_id}/members/add?token=${token}`, { members });
  return response.data.response;
}

async function membersResults(token, group_id, results_id) {
  const response = await stateless.get(`/groups/${group_id}/members/results/${results_id}?token=${token}`);
  return response.data.response;
}

async function membersRemove(token, group_id, membership_id) {
  const response = await stateless.post(`/groups/${group_id}/members/${membership_id}/remove?token=${token}`);
  return null;
}

async function membersUpdate(token, group_id, nickname, avatar_url) {
  const membership = { nickname, avatar_url };
  const response = await stateless.post(`/groups/${group_id}/memberships/update?token=${token}`, { membership });
  return response.data.response;
}

async function messagesIndex(token, group_id) {
  const { count, messages } = await messagesIndexAfter(token, group_id, 0);
  return { count, messages: messages.reverse() };
}

async function messagesIndexAfter(token, group_id, after_id) {
  let response;
  try {
    response = await stateless.get(`/groups/${group_id}/messages?after_id=${after_id}&token=${token}`);
  } catch (error) {
    return { count: 0, messages: [] };
  }
  const { count, messages } = response.data.response;
  let next;
  try {
    next = await messagesIndexAfter(token, group_id, messages[messages.length - 1].id);
  } catch (error) {
    return { count, messages };
  }
  return { count, messages: messages.concat(next.messages) };
}

async function messagesCreate(token, group_id, source_guid, text, attachments) {
  const message = { source_guid, text, attachments };
  const response = await stateless.post(`/groups/${group_id}/messages?token=${token}`, { message });
  return response.data.response;
}

async function chatsIndex(token) {
  const chats = [];
  let page = 1;
  let indexPage;
  do {
    const response = await stateless.get(`/chats?page=${page}&token=${token}`);
    indexPage = response.data.response;
    ++page;
    chats.push(indexPage);
  } while (indexPage.length)
  return chats.flat();
}

async function dmsIndex(token, other_user_id) {
  const dms = [];
  const firstPage = await stateless.get(`/direct_messages?other_user_id=${other_user_id}&token=${token}`);
  const index = firstPage.data.response;
  let messages = index.direct_messages;
  while (messages.length) {
    dms.push(messages);
    const next_id = messages[messages.length - 1].id;
    const response = await stateless.get(`/direct_messages?other_user_id=${other_user_id}&before_id=${next_id}&token=${token}`);
    messages = response.data.response.direct_messages;
  }
  index.direct_messages = dms.flat();
  return index;
}

async function dmsCreate(token, source_guid, recipient_id, text, attachments) {
  const direct_message = { source_guid, recipient_id, text, attachments };
  const response = await stateless.post(`/direct_messages?token=${token}`, { direct_message });
  return { message: response.data.response.direct_message };
}

async function likesCreate(token, conversation_id, message_id) {
  const response = await stateless.post(`/messages/${conversation_id}/${message_id}/like?token=${token}`);
  return null;
}

async function likesDestroy(token, conversation_id, message_id) {
  const response = await stateless.post(`/messages/${conversation_id}/${message_id}/unlike?token=${token}`);
  return null;
}

async function leaderboardIndex(token, group_id, period) {
  const response = await stateless.get(`/groups/${group_id}/likes?period=${period}&token=${token}`);
  return response.data.response;
}

async function leaderboardLikes(token, group_id) {
  const response = await stateless.get(`/groups/${group_id}/likes/mine?token=${token}`);
  return response.data.response;
}

async function leaderboardHits(token, group_id) {
  const response = await stateless.get(`/groups/${group_id}/likes/for_me?token=${token}`);
  return response.data.response;
}

async function botsCreate(token, name, group_id, avatar_url, callback_url, dm_notification) {
  const bot = { name, group_id, avatar_url, callback_url, dm_notification };
  const response = await stateless.post(`/bots?token=${token}`, { bot });
  return response.data.response.bot;
}

async function botsPost(token, bot_id, text, picture_url, attachments) {
  const response = await stateless.post(`/bots/post`, { bot_id, text, picture_url, attachments });
  return null;
}

async function botsIndex(token) {
  const response = await stateless.get(`/bots?token=${token}`);
  return response.data.response;
}

async function botsUpdate(token, bot_id, name, avatar_url, callback_url) {
  const bot = { bot_id, name, avatar_url, callback_url };
  const response = await stateless.post(`/bots/${bot_id}?token=${token}`, { bot });
  return null;
}

async function botsDestroy(token, bot_id) {
  const response = await stateless.post(`/bots/destroy?token=${token}`, { bot_id });
  return null;
}

async function usersMe(token) {
  const response = await stateless.get(`/users/me?token=${token}`);
  return response.data.response;
}

async function usersUpdate(token, avatar_url, name, email, zip_code) {
  const response = await stateless.post(`/users/update?token=${token}`, { avatar_url, name, email, zip_code });
  return response.data.response;
}

async function smsCreate(token, duration, registration_id) {
  const response = await stateless.post(`/users/sms_mode?token=${token}`, { duration, registration_id });
  return null;
}

async function smsDelete(token) {
  const response = await stateless.post(`/users/sms_mode/delete?token=${token}`);
  return null;
}

async function blocksIndex(token, user) {
  const response = await stateless.get(`/blocks?user=${user}&token=${token}`);
  return response.data.response;
}

async function blocksBetween(token, user, other_user) {
  const response = await stateless.get(`/blocks/between?user=${user}&otherUser=${other_user}&token=${token}`);
  return response.data.response;
}

async function blocksCreate(token, user, other_user) {
  const response = await stateless.post(`/blocks?user=${user}&otherUser=${other_user}&token=${token}`);
  return response.data.response;
}

async function blocksUnblock(token, user, other_user) {
  const response = await stateless.delete(`/blocks?user=${user}&otherUser=${other_user}&token=${token}`);
  return null;
}

async function picturesPictures(token, format, dataStream) {
  const response = await imageService.post(`/pictures`, dataStream, {
    headers: {
      'X-Access-Token': token,
      'Content-Type': `image/${format}`
    }
  });
  return response.data;
}

exports.groups = {
  index: groupsIndex,
  former: groupsFormer,
  show: groupsShow,
  create: groupsCreate,
  update: groupsUpdate,
  destroy: groupsDestroy,
  join: groupsJoin,
  rejoin: groupsRejoin,
  changeOwners: groupsChown
};
exports.members = {
  add: membersAdd,
  results: membersResults,
  remove: membersRemove,
  update: membersUpdate
};
exports.messages = {
  index: messagesIndex,
  create: messagesCreate
};
exports.chats = {
  index: chatsIndex
};
exports.directMessages = {
  index: dmsIndex,
  create: dmsCreate
};
exports.likes = {
  create: likesCreate,
  destroy: likesDestroy
};
exports.leaderboard = {
  index: leaderboardIndex,
  myLikes: leaderboardLikes,
  myHits: leaderboardHits
};
exports.bots = {
  create: botsCreate,
  post: botsPost,
  index: botsIndex,
  update: botsUpdate,
  destroy: botsDestroy
};
exports.users = {
  me: usersMe,
  update: usersUpdate
};
exports.smsMode = {
  create: smsCreate,
  delete: smsDelete
};
exports.blocks = {
  index: blocksIndex,
  blockBetween: blocksBetween,
  createBlock: blocksCreate,
  unblock: blocksUnblock
};
exports.pictures = {
  pictures: picturesPictures
};
