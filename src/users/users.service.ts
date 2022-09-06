import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input.dto';
import { Model } from 'mongoose';
import { User } from './user.entity';
import { passwordTransformation } from '../utils/cryptography';

var mongoose = require('mongoose');

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    let user: any;
    user = await this.userModel.findOne({ email: createUserInput.email });
    if (user) {
      throw new BadRequestException('User Already Exists');
    }
    createUserInput.password = passwordTransformation.to(
      createUserInput.password,
    );
    const { username, email, password } = createUserInput;
    const newUser = new this.userModel({
      username,
      email,
      password,
    });
    const createdUser = await newUser.save();
    return createdUser;
  }

  async findByEmail(email: string) {
    return await this.userModel.find({ email });
  }

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(id: string) {
    return await this.userModel.findOne({ _id: id });
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    try {
      if (updateUserInput.password) {
        updateUserInput.password = passwordTransformation.to(
          updateUserInput.password,
        );
      }
      const updatedUser = await this.userModel
        .findOneAndUpdate({ _id: id }, { $set: updateUserInput }, { new: true })
        .exec();

      if (!updatedUser) {
        throw new NotFoundException('user not found');
      }
      console.log('updated user =>', updatedUser);
      return updatedUser;
    } catch (error) {
      throw new BadRequestException('email already exists', error);
    }
  }

  async remove(id: string) {
    const user = await this.userModel.findOneAndDelete({ _id: id }).exec();
    if (!user) {
      throw new NotFoundException('user not found');
    }
    console.log('removed user =>', user);
    return user;
  }
}
