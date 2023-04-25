import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../../common/decoratos/role.enum';
import { Roles } from '../../common/decoratos/roles.decorator';
import { VoteService } from './vote.service';
import { MonsterService } from '../monster/monster.service';

@ApiTags('vote')
@Controller('vote')
export class VoteController {
  constructor(private voteService: VoteService, private monsterService: MonsterService) {}
  @Roles(Role.Ceo)
  @Post('start')
  async startVotingSession() {
    try {
      return await this.voteService.startVotingSession();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Roles(Role.Ceo)
  @Post('stop')
  async endVotingSession() {
    try {
      return await this.voteService.stopVotingSession();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Roles(Role.Ceo, Role.User, Role.Admin)
  @Get('status')
  async viewVotes() {
    return await this.voteService.viewVotes();
  }

  @Roles(Role.Ceo, Role.User, Role.Admin)
  @Post()
  async vote(@Request() req, @Query('monsterId') voteFor: string) {
    const monster = await this.monsterService.findOne(voteFor);
    if (!monster) {
      throw new NotFoundException();
    }
    try {
      return await this.voteService.vote(req.user, voteFor);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
