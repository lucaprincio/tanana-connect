import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    imageUrl?: string;
    userId: number;
  }) {
    return this.prisma.report.create({ data });
  }

  async findAll() {
    return this.prisma.report.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.report.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async updateStatus(id: number, status: Status) {
    return this.prisma.report.update({
      where: { id },
      data: { status },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
