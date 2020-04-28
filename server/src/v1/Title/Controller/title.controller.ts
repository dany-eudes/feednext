// Nest dependencies
import { Controller, UseGuards, Headers, Post, Body, HttpException, Get, Param, Query, Delete, Patch } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport/dist/auth.guard'

// Local dependencies
import { RolesGuard } from 'src/shared/Guards/roles.guard'
import { CreateTitleDto } from '../Dto/create-title.dto'
import { jwtManipulationService } from 'src/shared/Services/jwt.manipulation.service'
import { Roles } from 'src/shared/Decorators/roles.decorator'
import { UpdateTitleDto } from '../Dto/update-title.dto'
import { ISerializeResponse } from 'src/shared/Services/serializer.service'
import { TitleService } from '../Service/title.service'
import { RateTitleDto } from '../Dto/rate-title.dto'
import { Role } from 'src/shared/Enums/Roles'

@ApiTags('v1/title')
@Controller()
@UseGuards(RolesGuard)
@Controller()
export class TitleController {
    constructor(private readonly titleService: TitleService) {}

    @Get(':titleQueryData')
    getTitle(
        @Param('titleQueryData') titleQueryData: string,
        @Query('type') type: 'id' | 'slug'
    ): Promise<ISerializeResponse> {
        return this.titleService.getTitle(titleQueryData, type === 'id')
    }

    @Get('search')
    searchTitle(@Query('searchValue') searchValue: string): Promise<ISerializeResponse> {
        return this.titleService.searchTitle({ searchValue })
    }

    @Get('all')
    getTitleList(
        @Query() query: {
            author: string,
            categoryIds: any,
            sortBy: 'hot' | 'top',
            limit: number,
            skip: number,
        }
    ): Promise<ISerializeResponse> {
        if (query.categoryIds) query.categoryIds = query.categoryIds.split(',')
        return this.titleService.getTitleList(query)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post('create-title')
    @Roles(Role.JuniorAuthor)
    createTitle(@Headers('authorization') bearer: string, @Body() dto: CreateTitleDto): Promise<HttpException | ISerializeResponse> {
        return this.titleService.createTitle(jwtManipulationService.decodeJwtToken(bearer, 'username'), dto)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Patch(':titleId')
    @Roles(Role.Admin)
    updateTitle(
        @Headers('authorization') bearer: string,
        @Param('titleId') titleId: string,
        @Body() dto: UpdateTitleDto,
    ): Promise<ISerializeResponse> {
        return this.titleService.updateTitle(jwtManipulationService.decodeJwtToken(bearer, 'username'), titleId, dto)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Patch(':titleId/rate')
    @Roles(Role.User)
    rateTitle(
        @Headers('authorization') bearer: string,
        @Param('titleId') titleId: string,
        @Body() dto: RateTitleDto
    ): Promise<HttpException> {
        return this.titleService.rateTitle(jwtManipulationService.decodeJwtToken(bearer, 'username'), titleId, dto.rateValue)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get(':titleId/rate-of-user')
    @Roles(Role.User)
    getRateOfUser(
        @Headers('authorization') bearer: string,
        @Param('titleId') titleId: string,
    ): Promise<HttpException> {
        return this.titleService.getRateOfUser(jwtManipulationService.decodeJwtToken(bearer, 'username'), titleId)
    }

    @Get(':titleId/average-rate')
    getAvarageRate(@Param('titleId') titleId: string): Promise<ISerializeResponse> {
        return this.titleService.getAvarageRate(titleId)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Delete(':titleId')
    @Roles(Role.SuperAdmin)
    deleteTitle(@Param('titleId') titleId: string): Promise<HttpException> {
        return this.titleService.deleteTitle(titleId)
    }
}