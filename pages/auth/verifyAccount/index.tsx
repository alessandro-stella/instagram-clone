import { GetServerSideProps } from "next";

export default function CompleteRegistration() {
    return;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        redirect: {
            destination: "/auth/login",
            permanent: false,
        },
    };
};
