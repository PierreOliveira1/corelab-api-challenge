import validate from 'uuid-validate';

function uuidValidate(id: string): boolean {
	return validate(id, 4);
}

export default uuidValidate;
