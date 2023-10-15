
const helpers = {
    handleResponse(res, status, load) {
        return res.status(status).json(load).send();
    },
}

export default helpers;