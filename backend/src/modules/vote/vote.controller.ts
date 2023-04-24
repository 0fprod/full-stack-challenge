import { Controller, NotImplementedException, Post } from '@nestjs/common';
import { Role } from 'src/common/decoratos/role.enum';
import { Roles } from 'src/common/decoratos/roles.decorator';

@Controller('vote')
export class VoteController {
  @Roles(Role.Ceo)
  @Post('start')
  startVotingSession() {
    throw new NotImplementedException();
  }

  @Roles(Role.Ceo)
  @Post('end')
  endVotingSession() {
    throw new NotImplementedException();
  }

  @Roles(Role.User)
  @Post()
  vote() {
    throw new NotImplementedException();
  }
}
