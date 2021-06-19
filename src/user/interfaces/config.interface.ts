import { Document } from 'mongoose'

export interface IConfig extends Document {
  isRepoForAny: boolean
  isBoardForAny: boolean
  canCommentAny: boolean
}
