//
//  CKSmileSpotTests.m
//  CKSmileSpotTests
//
//  Created by Administrator on 7/12/14.
//  Copyright (c) 2014 Connor. All rights reserved.
//

#import <XCTest/XCTest.h>
#import "CKUserModel.h"

@interface CKSmileSpotTests : XCTestCase

@property (nonatomic) CKUserModel* userModel;
@property (nonatomic) NSArray* userArray;

@end

@implementation CKSmileSpotTests

-(void)setUp{
    [super setUp];
    self.userModel = [[CKUserModel alloc]init];
    
    self.userArray = [self.userModel fillArray];

}

-(void)tearDown{
    // Put teardown code here. This method is called after the invocation of each test method in the class.
    [super tearDown];
}

-(void)testExample{
    XCTFail(@"No implementation for \"%s\"", __PRETTY_FUNCTION__);
}

-(void)testThatUsernameCanBeAddedToArray{
    XCTAssertNil(self.userArray);

}



@end
