export interface SingleUserType {
  id: number,
  name: string,
  email: string,
  create_time: string,
  update_time: string,
  status: 1
}

export interface FormValue {
  [name: string]: any
}