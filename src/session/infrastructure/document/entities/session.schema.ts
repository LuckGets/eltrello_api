import mongoose, { HydratedDocument, now } from 'mongoose';
import { DocumentEntityHelper } from '../../../../utils';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserSchemaClass } from '../../../../users';
import { IsNotEmpty, IsString } from 'class-validator';

export type SessionDocument = HydratedDocument<SessionSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class SessionSchemaClass extends DocumentEntityHelper {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: UserSchemaClass,
  })
  user: UserSchemaClass;

  @IsNotEmpty()
  @IsString()
  @Prop({
    type: String,
  })
  hash: string;
  @Prop({
    default: now,
  })
  createdAt: Date;
  @Prop({
    default: now,
  })
  updatedAt: Date;
  deletedAt?: Date;
}

export const SessionSchema = SchemaFactory.createForClass(SessionSchemaClass);
