
public class Mint {

	static int[] numPerDen = {1,2,3,4,5,6,7};
	static int numPense = 240;

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		getScore();
		
	}
	
	public static void getScore() {
		
		for (int j = 1; j < numPense; j++) {
			Integer payout = j;
			for (int i = numPerDen.length - 1; i >= 0; i--) {
				System.out.print(numPerDen[i] + " ");
				
			}
			System.out.println(j);
		}
	}

}
