CREATE SCHEMA IF NOT EXISTS messaging;

CREATE TYPE messaging.friend_request_status AS ENUM (
    'accepted',
    'rejected',
    'pending'
);

CREATE TYPE messaging.chat_type AS ENUM (
    'group',
    'single'
);

CREATE TYPE messaging.message_type AS ENUM (
    'text',
    'image',
    'file'
);


CREATE TABLE messaging.friend_requests (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    status messaging.friend_request_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_friend_sender
        FOREIGN KEY (sender_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_friend_receiver
        FOREIGN KEY (receiver_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_not_self
        CHECK (sender_id <> receiver_id),

    CONSTRAINT uq_friend_request
        UNIQUE(sender_id, receiver_id)
);

CREATE INDEX idx_friend_sender
ON messaging.friend_requests(sender_id);

CREATE INDEX idx_friend_receiver
ON messaging.friend_requests(receiver_id);

CREATE INDEX idx_friend_status
ON messaging.friend_requests(status);

CREATE TABLE messaging.friends (
    id SERIAL PRIMARY KEY,
    user_id_1 INTEGER NOT NULL,
    user_id_2 INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_friend1
        FOREIGN KEY(user_id_1)
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_friend2
        FOREIGN KEY(user_id_2)
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_friend_order
        CHECK(user_id_1 < user_id_2),

    CONSTRAINT uq_friends
        UNIQUE(user_id_1, user_id_2)
);

CREATE INDEX idx_friends_user1
ON messaging.friends(user_id_1);

CREATE INDEX idx_friends_user2
ON messaging.friends(user_id_2);

CREATE TABLE messaging.chats (
    id SERIAL PRIMARY KEY,
    type messaging.chat_type NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messaging.chat_members (
    chat_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    alias VARCHAR(255),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,

    PRIMARY KEY(chat_id, user_id),

    CONSTRAINT fk_chat
        FOREIGN KEY(chat_id)
        REFERENCES messaging.chats(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_chat_user
        FOREIGN KEY(user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_chat_members_user
ON messaging.chat_members(user_id);

CREATE TABLE messaging.messages (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    type messaging.message_type NOT NULL DEFAULT 'text',
    message TEXT NOT NULL,
    attachment_url TEXT,
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP,
    is_edited BOOLEAN NOT NULL DEFAULT FALSE,
    edited_at TIMESTAMP,
    reply_to_message_id INTEGER,

    CONSTRAINT fk_message_chat
        FOREIGN KEY(chat_id)
        REFERENCES messaging.chats(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_message_sender
        FOREIGN KEY(sender_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_reply_message
        FOREIGN KEY(reply_to_message_id)
        REFERENCES messaging.messages(id)
        ON DELETE SET NULL
);

CREATE INDEX idx_messages_chat
ON messaging.messages(chat_id, sent_at DESC);

CREATE INDEX idx_messages_sender
ON messaging.messages(sender_id);

CREATE INDEX idx_messages_reply
ON messaging.messages(reply_to_message_id);

CREATE TABLE messaging.message_reads (
    message_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    seen_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(message_id, user_id),

    CONSTRAINT fk_read_message
        FOREIGN KEY(message_id)
        REFERENCES messaging.messages(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_read_user
        FOREIGN KEY(user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_message_reads_user
ON messaging.message_reads(user_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_friend_requests_updated_at
BEFORE UPDATE ON messaging.friend_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_friends_updated_at
BEFORE UPDATE ON messaging.friends
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();