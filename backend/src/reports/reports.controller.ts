import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';
import { Status } from '@prisma/client';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  // Créer un signalement (citoyen connecté)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @Request() req,
    @Body()
    body: {
      title: string;
      description: string;
      latitude: string;
      longitude: string;
    },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.reportsService.create({
      title: body.title,
      description: body.description,
      latitude: parseFloat(body.latitude),
      longitude: parseFloat(body.longitude),
      imageUrl: file ? `/uploads/${file.filename}` : undefined,
      userId: req.user.id,
    });
  }

  // Liste tous les signalements (public)
  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  // Un seul signalement
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.findOne(id);
  }

  // Changer le statut (admin)
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: Status },
  ) {
    return this.reportsService.updateStatus(id, body.status);
  }

  // Signalements d'un citoyen
  @UseGuards(AuthGuard('jwt'))
  @Get('user/me')
  findMyReports(@Request() req) {
    return this.reportsService.findByUser(req.user.id);
  }
}
