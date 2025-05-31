import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ImgurClient from 'imgur';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class ImageService {
  private readonly imgurClient: ImgurClient;
  constructor(private readonly configService: ConfigService) {
    const clientId = this.configService.get<string>('IMGUR_CLIENT_ID');
    if (!clientId) {
      throw new InternalServerErrorException('IMGUR_CLIENT_ID is not defined');
    }
    this.imgurClient = new ImgurClient({ clientId });
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  private multerFileToBase64Uri(imageFile: Express.Multer.File): string {
    const base64 = imageFile.buffer.toString('base64');
    return `data:${imageFile.mimetype};base64,${base64}`;
  }

  async uploadImage(imageFile: Express.Multer.File) {
    if (!imageFile) {
      throw new BadRequestException('no file uploaded');
    }

    // validate file size () max 5mb)
    const maxSize = 5 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      throw new BadRequestException('file is too large!');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(imageFile.mimetype)) {
      throw new BadRequestException(
        'Unsupported file type! Allowed types: JPEG, PNG, GIF.',
      );
    }

    try {
      const imgLink = await this.uploadToCloudinary(imageFile);
      return imgLink;
    } catch (error) {
      throw new InternalServerErrorException(
        `Upload image failed: ${error.message}`,
      );
    }
  }

  private async uploadToImgur(imageFile: Express.Multer.File): Promise<string> {
    const base64 = imageFile.buffer.toString('base64');
    const res = await this.imgurClient.upload({
      image: base64,
    });

    if (!res.success) {
      throw new InternalServerErrorException(
        `Upload image failed with error: ${JSON.stringify(res.data)}`,
      );
    }

    return res.data.link;
  }

  private async uploadToCloudinary(
    imageFile: Express.Multer.File,
  ): Promise<string> {
    try {
      const base64Uri = this.multerFileToBase64Uri(imageFile);
      const res = await cloudinary.uploader.upload(base64Uri);
      return res.url;
    } catch (error) {}
  }
}
