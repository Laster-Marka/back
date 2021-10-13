import { Document } from 'mongoose'
import { IRole } from './role.interface'
import { IFolder } from '../../folder/interfaces/folder.interface'
import { ICountry } from './country.interface'
import { IConfig } from './config.interface'

export interface IUser extends Document {
  name: string
  nickname: string
  email: string
  password: string
  profilePic: string
  role: IRole
  folders: IFolder[]
  country: ICountry
  configuration: IConfig

  comparePassword: (password: string) => Promise<boolean>
}
