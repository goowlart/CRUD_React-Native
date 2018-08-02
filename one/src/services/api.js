import { create } from 'apisauce';

const api = create ({
	baseURL: 'http://localhost:3000',
});

api.addResponseTransform(response => {
	if (!response.ok) throw response;
});

export default api;
