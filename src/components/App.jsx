import { nanoid } from 'nanoid';
import { Component } from 'react';
import ContactForm from './ContactForm/ContactForm';
import { Filter } from './Filter/Filter';
import { ContactList } from './ContactList/ContactList';
import { Notify } from 'notiflix';


const LOCASSTORAGE_KEY = 'contacts-key'



class App extends Component {
	state = {
		contacts: [],
		filter: '',
	};
	componentDidMount() {
		const savedState = localStorage.getItem(LOCASSTORAGE_KEY)

		if(savedState){
			const savedContacts = JSON.parse(localStorage.getItem(LOCASSTORAGE_KEY))
			this.setState({contacts: savedContacts})
		}
	}
	componentDidUpdate(_, prevState) {
		const {contacts} = this.state;
		if(prevState.contacts !== contacts) {
			if(!contacts.length){
				localStorage.removeItem(LOCASSTORAGE_KEY)
			} else {
				localStorage.setItem(LOCASSTORAGE_KEY, JSON.stringify(contacts))
			}
		}
	}

	addContact = newContact => {
		const { contacts } = this.state;
		const newName = newContact.name.toLowerCase();
		const isCheckedContact = contacts.find(
			({ name }) => name.toLowerCase() === newName
		);

		if (!isCheckedContact) {
			newContact.id = nanoid();
			this.setState({ contacts: [...this.state.contacts, newContact] });
		} else {
			Notify.failure(`${newContact.name} is already in contacts`);
		}
	};

	findContact = ({ target: { value } }) => {
		this.setState({ filter: value.toLowerCase() });
	};

	filteredContact = () => {
		const { contacts, filter } = this.state;
		const suitableContacts = contacts.filter(({ name }) =>
			name.toLowerCase().includes(filter)
		);

		return filter === '' ? contacts : suitableContacts;
	};

	deleteContact = idDeleteContact => {
		this.setState({
			contacts: this.state.contacts.filter(({ id }) => id !== idDeleteContact),
		});
	};

	render() {
		const { addContact, findContact, deleteContact, filteredContact } = this;

		return (
			<div className="container">
				<h1>Phonebook</h1>
				<ContactForm addContact={addContact} />
				<h2>Contacts</h2>
				<Filter
					findContact={findContact}
				/>
				<ContactList filteredContact={filteredContact()} deleteContact={deleteContact} />
			</div>
		);
	}
}

export default App;
