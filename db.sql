CREATE TABLE device_to_wallet (
    device CHAR(33) NOT NULL PRIMARY KEY,
    wallet CHAR(32) UNIQUE NOT NULL,
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wallet_to_reservation (
    wallet CHAR(32) UNIQUE NOT NULL PRIMARY KEY,
    username VARCHAR(320) UNIQUE NOT NULL,
    payment_address CHAR(32) NOT NULL,
    payment_amount INT NOT NULL,
    is_confirmed INT NOT NULL DEFAULT 0,
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet) REFERENCES outputs(address),
    FOREIGN KEY (payment_amount) REFERENCES outputs(amount)
);

CREATE TABLE wallet_to_username (
    wallet CHAR(32) UNIQUE NOT NULL PRIMARY KEY,
    username VARCHAR(320) UNIQUE NOT NULL,
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);