import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Post,
  Query,
  Request,
  forwardRef,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '../../common/decoratos/role.enum';
import { Roles } from '../../common/decoratos/roles.decorator';
import { VoteService } from './vote.service';
import { MonsterService } from '../monster/monster.service';
import { Public } from '../../common/decoratos/auth.decorator';
import { Vote } from './entity/vote.entity';

@ApiTags('vote')
@Controller('vote')
export class VoteController {
  constructor(
    private voteService: VoteService,
    @Inject(forwardRef(() => MonsterService)) private monsterService: MonsterService,
  ) {}

  @ApiBearerAuth('swaggerBearerAuth')
  @ApiOperation({ summary: 'Starts a voting session' })
  @ApiResponse({ status: 201, type: Vote })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles(Role.Ceo)
  @Post('start')
  async startVotingSession() {
    try {
      return await this.voteService.startVotingSession();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @ApiBearerAuth('swaggerBearerAuth')
  @ApiOperation({ summary: 'Stops an existing voting session' })
  @ApiResponse({ status: 200, type: Vote })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
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

  @ApiOperation({ summary: 'Retrieves the current voting session' })
  @ApiResponse({ status: 200, type: Vote })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Get('status')
  async viewVotes() {
    const votes = await this.voteService.viewVotes();
    if (!votes) {
      throw new NotFoundException();
    }
    return votes;
  }

  @ApiBearerAuth('swaggerBearerAuth')
  @ApiOperation({ summary: 'Allow logged in users to register a vote' })
  @ApiResponse({ status: 200, type: Vote })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
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
