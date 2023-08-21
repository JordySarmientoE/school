import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { TeacherModule } from './teacher/teacher.module';
import { ParentModule } from './parent/parent.module';
import { StudentModule } from './student/student.module';
import { SubjectModule } from './subject/subject.module';
import { CourseModule } from './course/course.module';
import { AuthModule } from './auth/auth.module';
import { AcademicStructureModule } from './academic-structure/academic-structure.module';
import { ClassroomModule } from './classroom/classroom.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AdminModule,
    TeacherModule,
    ParentModule,
    StudentModule,
    SubjectModule,
    CourseModule,
    AuthModule,
    AcademicStructureModule,
    ClassroomModule,
  ],
})
export class AppModule {}
