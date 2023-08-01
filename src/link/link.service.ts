import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/commom/shared/abstract.service';
import { Links } from './link';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LinkService extends AbstractService<Links>{
   constructor(@InjectRepository(Links) private linksRepository){
     super(linksRepository);
   }
}
