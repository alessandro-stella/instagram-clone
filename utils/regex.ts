export const usernameRegex = /^[a-zA-Z0-9_.]+$/;

export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!\"#$%&'()*+,-.\/:;<=>?@\[\]\\^_`{|}~])[A-Za-z\d!\"#$%&'()*+,-.\/:;<=>?@\[\]\\^_`{|}~\s]{8,}$/;
