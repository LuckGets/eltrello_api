import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuthProvidersEnum } from '../../../../auth/auth-providers.enum';
import { DocumentEntityHelper } from '../../../../utils';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { HydratedDocument, now } from 'mongoose';

export type UserDocument = HydratedDocument<UserSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class UserSchemaClass extends DocumentEntityHelper {
  @IsNotEmpty()
  @Prop({
    type: String,
  })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @Prop({
    type: String,
    unique: true,
  })
  email: string;

  @IsNotEmpty()
  @Prop({ required: true })
  password: string;

  @Prop({
    default: AuthProvidersEnum.email,
  })
  provider: AuthProvidersEnum;

  @Prop({
    default: now,
  })
  createdAt: Date;

  @Prop({
    default: now,
  })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);
