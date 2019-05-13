// Examples
// class Person {
// 	constructor (name,age) {
// 		this.name = name;
// 		this.age = age;
// 	}
// 	getUserDescription(){
// 		return this.name+'Jen is 1 year old';
// 	}
// }

// var me = new Person('Andrew',45);
// var descripton = me.getUserDescription();
// console.log(descripton);


class Users{
	constructor(){
		this.users = [];
	}
	addUser (id,name,room){
		var user = {id,name,room};
		//console.log(this.users);
		this.users.push(user);
		return user;
	}

	removeUser(id){
		// return user that was removed
		
		var user = this.getUser(id);

		if(user){
			this.users = this.users.filter((user) => user.id !=id);

		}
		
		return user;
	}

	getUser(id){

		var x = this.users.filter((user) => user.id === id);
		return x[0];
	}
	getUserList(room){
		var users = this.users.filter((user) => user.room === room);
		var namesArray = users.map((user) => user.name);
		return namesArray;
	}

	getUserListsize(room){

		var users = this.users.filter((user) => user.room === room);
		var namesArray = users.map((user) => user.name);
		return namesArray.length;
	}
}

module.exports = {Users};