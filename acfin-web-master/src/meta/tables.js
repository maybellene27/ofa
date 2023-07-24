const tables = {
  admin: {
    userRole: 'admin',
    columns: [
      { value: 'email', text: 'Email', sortable: true },
      { value: 'fullName', text: 'Name', sortable: true },
      { value: 'userRole', text: 'Role', sortable: true },
      { value: 'agency.name', text: 'Agency Name', sortable: true },
      { value: 'dateCreated', text: 'Date Created', sortable: true },
      { value: '_status', text: 'Status', sortable: true },
      { value: 'actions', text: 'Actions', sortable: false, align: 'center' }
    ]
  },
  roles: {
    columns: [
      { value: '_configType', text: 'Role', sortable: true },
      { value: 'dateCreated', text: 'Date Created', sortable: true },
      { value: 'actions', text: 'Actions', sortable: false, align: 'end' }
    ]
  }
}

export default tables
