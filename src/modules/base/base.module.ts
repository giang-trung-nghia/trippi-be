import { Module } from '@nestjs/common';

/**
 * Lightweight module that centralizes and exports the abstractions defined in
 * the `base` folder. Feature modules can import from this module to keep a
 * consistent structure across the application.
 */
@Module({})
export class BaseModule {}

