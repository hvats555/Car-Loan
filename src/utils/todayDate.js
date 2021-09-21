import dayjs from "dayjs";

const todaysDate = () => {
    return dayjs().format('YYYY-MM-DD');
}

export default todaysDate;